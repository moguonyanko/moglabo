((window, document) => {
    "use strict";
    
    const NORMAL_KANTAI_TEISU = 5;

    class EquipmentType {
        constructor({ name, revisionValue = 0 }) {
            this.name = name;
            this.revisionValue = revisionValue;
        }
        toString() {
            return this.name;
        }
    }
    
    class Equipment {
        constructor({ type, force = 0, raisou = 0, bakusou = 0, improvement = 0 }) {
            this.type = type;
            this.force = force;
            this.raisou = raisou;
            this.bakusou = bakusou;
            this.improvement = improvement;
        }
        get improvedForce() {
            return this.type.revisionValue * Math.sqrt(this.improvement);
        }
        toString() {
            const msg = [
                `装備種別:${this.type}`,
                `火力:${this.force}`,
                `雷装:${this.raisou}`,
                `爆装:${this.bakusou}`,
                `改修度:${this.improvement}`
            ];
            return msg.join(",");
        }
    } 
    
    class Ship {
        constructor({ name, force = 0, raisou = 0, equipments = [] }) {
            this.name = name;
            this.force = force; // 素の火力
            this.raisou = raisou; // 素の雷装
            this.equipments = equipments;
        }
        get equipmentsForce() {
            const eqpForce = this.equipments
                    .map(eqp => eqp.force + eqp.improvedForce)
                    .reduce((a, b) => a + b, 0);
            return eqpForce;
        }
        get equipmentsRaisou() {
            const eqpRaisou = this.equipments
                    .map(eqp => eqp.raisou)
                    .reduce((a, b) => a + b, 0);
            return eqpRaisou;
        }
        get equipmentsBakusou() {
            const eqpRaisou = this.equipments
                    .map(eqp => eqp.bakusou)
                    .reduce((a, b) => a + b, 0);
            return eqpRaisou;
        }
        toString() {
            return `${this.name} -> ${this.equipments
                    .map(e => `[${e.toString()}]`).join(",")}`;
        }
    }
    
    // 空母系以外
    class UnAircraftCarrier extends Ship {
        constructor({ name, force = 0, raisou = 0, equipments = [] }) {
            super({ name, force, raisou, equipments });
        }
        get power() {
            return this.force + this.equipmentsForce + NORMAL_KANTAI_TEISU;
        }
    }
    
    // 空母系
    class AircraftCarrier extends Ship {
        constructor({ name, force = 0, raisou = 0, equipments = [] }) {
            super({ name, force, raisou, equipments });
        }
        get power() {
            const f = this.force + this.equipmentsForce;
            const r = this.raisou + this.equipmentsRaisou;
            const b = Math.trunc(this.equipmentsBakusou * 1.3);
            const p = Math.trunc((f + r + b) * 1.5) + 55;
            return p;
        }
    }
    
    const testFunc1 = () => {
        const eqpType = new EquipmentType({
            name: "小口径主砲", 
            revisionValue: 1.0
        });
        const shuhou = new Equipment({
            type: eqpType,
            force: 2,
            improvement: 10
        });
        const ship = new UnAircraftCarrier({
            name: "五月雨改",
            force: 49,
            raisou: 79,
            equipments: [ shuhou, shuhou ]
        });
        console.log(ship);
        console.log(ship.toString());
        console.log(ship.power);
    };
    
    const testFunc2 = () => {
        const eqpType1 = new EquipmentType({
            name: "噴式爆撃機", 
            revisionValue: 0
        });
        const keiunkai = new Equipment({
            type: eqpType1,
            bakusou: 15
        });
        const eqpType2 = new EquipmentType({
            name: "艦上攻撃機", 
            revisionValue: 0
        });
        const ryuseikai = new Equipment({
            type: eqpType2,
            raisou: 13
        });
        const eqpType3 = new EquipmentType({
            name: "艦上爆撃機", 
            revisionValue: 10
        });
        const iwaitai = new Equipment({
            type: eqpType3,
            bakusou: 4
        });
        const ship = new AircraftCarrier({
            name: "翔鶴改二甲",
            force: 70,
            raisou: 0,
            equipments: [ keiunkai, ryuseikai, iwaitai ]
        });
        console.log(ship);
        console.log(ship.toString());
        console.log(ship.power);
    };
    
    // DOM
    
    const loadEquipmentTypeConfig = async () => {
        const response = await fetch("../../config/improvementrevisions.json");
        if (!response.ok) {
            throw new Error("Failed loading config");
        }
        const config = await response.json();
        return config;
    };
    
    const initEquipmentTypeSelectElements = equipmentTypes => {
        const base = document.querySelector(".select-equipment-type");
        Object.keys(equipmentTypes).forEach(name => {
            const option = document.createElement("option");
            option.setAttribute("value", name);
            option.appendChild(document.createTextNode(name));
            base.options.add(option);
        });
        
        const slotSize = 5;
        const configBase = document.querySelector(".equipment-config");
        const configContainer = document.querySelector(".equipment-container");
        for (let i = 0; i < slotSize; i++) {
            const clonedNode = configContainer.cloneNode(true);
            configBase.appendChild(clonedNode);
        }
    };
    
    const makeEquipmentTypes = async () => {
        const config = await loadEquipmentTypeConfig();
        const equipmentTypes = Object.entries(config.revisions)
                .map(entry => {
                    return { [entry[0]]: new EquipmentType(entry[0], entry[1]) };
                })
                .reduce((a, b) => Object.assign(a, b), {});
        return equipmentTypes;
    };
    
    const getEquipmentOfOneSlot = (slot, equipmentTypes) => {
        const typeName = slot.querySelector(".select-equipment-type").value;
        if (!typeName || !(typeName in equipmentTypes)) {
            return null;
        }
        const type = equipmentTypes[typeName];
        const {force, raisou, bakusou} = {
            force: parseInt(slot.querySelector(".force").value),
            raisou: parseInt(slot.querySelector(".raisou").value),
            bakusou: parseInt(slot.querySelector(".bakusou").value)
        };
        const improvement = parseInt(slot.querySelector(".improvement").value);
        const equipment = new Equipment({
            type, force, raisou, bakusou, improvement
        });
        return equipment;
    };
    
    const isAircraftCarrier = shipContainer => {
        return shipContainer.querySelector(".check-aircraft-carrier").checked;
    };
    
    const createShip = ({ shipContainer, equipments }) => {
        const name = shipContainer.querySelector(".ship-name").value;
        const { force, raisou } = {
            force: parseInt(shipContainer.querySelector(".force").value),
            raisou: parseInt(shipContainer.querySelector(".raisou").value)
        };
        if (isAircraftCarrier(shipContainer)) {
            return new AircraftCarrier({
                name, force, raisou, equipments
            });
        } else {
            return new UnAircraftCarrier({
                name, force, raisou, equipments
            });
        }
    };
    
    const getShipPower = equipmentTypes => {
        const slots = document.querySelectorAll(".equipment-container");
        const equipments = Array.from(slots)
                .map(slot => getEquipmentOfOneSlot(slot, equipmentTypes))
                .filter(eqp => eqp !== null);
        
        const shipContainer = document.querySelector(".ship-container");
        const ship = createShip({ shipContainer, equipments });
        
        return ship.power;
    };
    
    const addListener = equipmentTypes => {
        const executer = document.querySelector(".execute");
        executer.addEventListener("click", () => {
            const power = getShipPower(equipmentTypes);
            const output = document.querySelector(".output");
            output.innerHTML = power;
        });
    };
    
    const init = async () => {
        testFunc1();
        testFunc2();
        
        const equipmentTypes = await makeEquipmentTypes();
        initEquipmentTypeSelectElements(equipmentTypes);
        addListener(equipmentTypes);
    };
    
    window.addEventListener("DOMContentLoaded", init);
})(window, document);
