//
//  graph.swift
//  Algorithm
//
// Reference:
// 「アルゴリズムとデータ構造」SoftbankCreative
//

import Foundation

private class Station: Equatable {
    private let name: String
    private var stations: [Station]
    init(name: String, stations: [Station]) {
        self.name = name
        self.stations = stations
    }
    convenience init(name: String) {
        self.init(name: name, stations: [Station]())
    }
    func add(station: Station) {
        let existStation = stations.contains { $0 == station }
        guard !existStation else {
            return
        }
        stations.append(station)
    }
    static func ==(lhs: Station, rhs: Station) -> Bool {
        return lhs.name == rhs.name && lhs.stations == rhs.stations
    }
    func getStationInfo() -> String {
        let result = stations.map {
            "->\($0.name) "
        }.joined()
        return "\(name) \(result)"
    }
}

private func printSampleStations() {
    let stations = [
        Station(name: "鎌倉"),
        Station(name: "藤沢"),
        Station(name: "横浜"),
        Station(name: "横須賀"),
        Station(name: "茅ヶ崎"),
        Station(name: "東京"),
    ]
    
    stations[0].add(station: stations[3])
    stations[0].add(station: stations[1])
    stations[0].add(station: stations[2])
    
    stations[1].add(station: stations[0])
    stations[1].add(station: stations[4])
    stations[1].add(station: stations[2])
    
    stations[2].add(station: stations[1])
    stations[2].add(station: stations[0])
    stations[2].add(station: stations[5])
    
    stations[3].add(station: stations[0])
    stations[4].add(station: stations[1])
    stations[5].add(station: stations[2])
    
    stations.forEach { print($0.getStationInfo()) }
}

private struct StationMatrix {
    private let matrix = [
        (stationName: "鎌倉", linkedStations: [0, 1, 1, 1, 0, 0]),
        (stationName: "藤沢", linkedStations: [1, 0, 1, 0, 1, 0]),
        (stationName: "横浜", linkedStations: [1, 1, 0, 0, 0, 1]),
        (stationName: "横須賀", linkedStations: [1, 0, 0, 0, 0, 0]),
        (stationName: "茅ヶ崎", linkedStations: [0, 1, 0, 0, 0, 0]),
        (stationName: "東京", linkedStations: [0, 0, 1, 0, 0, 0])
    ]
    var descriotion: String {
        var msg = [String]()
        for i in 0..<matrix.count {
            msg.append("\(matrix[i].stationName):")
            for j in 0..<matrix[i].linkedStations.count {
                if matrix[i].linkedStations[j] == 1 {
                    msg.append("->\(matrix[j].stationName) ")
                }
            }
            msg.append("\n")
        }
        return msg.joined()
    }
}

private func printStationMatrix() {
    let sm = StationMatrix()
    print(sm.descriotion)
}

private struct WeightStationMatrix {
    private let matrix = [
        (stationName: "横浜", linkedStations: [0, 12, 28, 0, 0, 0]),
        (stationName: "武蔵小杉", linkedStations: [12, 0, 10, 13, 0, 0]),
        (stationName: "品川", linkedStations: [28, 10, 0, 11, 7, 0]),
        (stationName: "渋谷", linkedStations: [0, 13, 11, 0, 0, 9]),
        (stationName: "新橋", linkedStations: [0, 0, 7, 0, 0, 4]),
        (stationName: "溜池山王", linkedStations: [0, 0, 0, 9, 4, 0])
    ]
    var descriotion: String {
        var msg = [String]()
        for i in 0..<matrix.count {
            msg.append("\(matrix[i].stationName):")
            for j in 0..<matrix[i].linkedStations.count {
                if matrix[i].linkedStations[j] > 0 {
                    let info = "->\(matrix[j].stationName)(\(matrix[i].linkedStations[j])分) "
                    msg.append(info)
                }
            }
            msg.append("\n")
        }
        return msg.joined()
    }
}

private func printWeightStationMatrix() {
    let wsm = WeightStationMatrix()
    print(wsm.descriotion)
}

// ダイクストラ法による最短経路探索
private let stationMatrix = [
    (stationName: "横浜", linkedStations: [0, 12, 28, 0, 0, 0]),
    (stationName: "武蔵小杉", linkedStations: [12, 0, 10, 13, 0, 0]),
    (stationName: "品川", linkedStations: [28, 10, 0, 11, 7, 0]),
    (stationName: "渋谷", linkedStations: [0, 13, 11, 0, 0, 9]),
    (stationName: "新橋", linkedStations: [0, 0, 7, 0, 0, 4]),
    (stationName: "溜池山王", linkedStations: [0, 0, 0, 9, 4, 0])
]

private struct ShortestRoute {
    private var currentCost: [Int]
    private var fix: [Bool]
    private var viaStations: [[String]]
    init() {
        currentCost = Array(repeating: -1, count: stationMatrix.count)
        fix = Array(repeating: false, count: stationMatrix.count)
        viaStations = Array(repeating: [String](), count: stationMatrix.count)
    }
    mutating func search(startIndex: Int) -> [(stationName: String, cost: Int,
        viaStations: [String])] {
        // 出発地点のコストはゼロ
        currentCost[startIndex] = 0
        var results = [(stationName: String, cost: Int, viaStations: [String])]()
        while true {
            var minStation = -1
            var minTime = -1
            for i in 0..<stationMatrix.count {
                // 未確定かつ到達不可能でない
                if !fix[i] && currentCost[i] != -1 {
                    // 最短時間が未登録またはより所要時間が短い駅が見つかった
                    if minTime == -1 || currentCost[i] < minTime {
                        minTime = currentCost[i]
                        minStation = i
                    }
                }
            }
            // 到達可能な駅が無かった，あるいは全ての駅を探索した
            if minTime == -1 {
                break
            }
            // 探索中の駅から繋がっている駅を走査して最も短い所要時間を保存する。
            for j in 0..<stationMatrix.count {
                if !fix[j] && stationMatrix[minStation].linkedStations[j] > 0 {
                    let newTime = minTime + stationMatrix[minStation].linkedStations[j]
                    // コスト未登録またはより短時間で到達可能
                    if currentCost[j] == -1 || newTime < currentCost[j] {
                        currentCost[j] = newTime
                        // 出発地点と最短駅地点が同じ場合は経由無しと見なして駅名を保存しない。
                        if startIndex != minStation {
                            viaStations[j].append(stationMatrix[minStation].stationName)
                        }
                    }
                }
            }
            fix[minStation] = true
        }
        for k in 0..<stationMatrix.count {
            results.append((stationName: stationMatrix[k].stationName,
                            cost: currentCost[k],
                            viaStations: viaStations[k]))
        }
        return results
    }
}

private func searchShortestRoute() {
    // mutatingなメソッドを利用するのでvarで宣言しなければならない。
    var sh = ShortestRoute()
    let startStationIndex = 0
    let results = sh.search(startIndex: startStationIndex)
    for i in 0..<results.count {
        let msg = [
            "\(stationMatrix[startStationIndex].stationName)->\(results[i].stationName)",
            "必要時間:\(results[i].cost)分",
            "経由駅:\(results[i].viaStations.description)"
        ]
        print(msg.joined(separator: " "))
    }
}

struct Graph {
    static func main() {
        //printSampleStations()
        //printStationMatrix()
        //printWeightStationMatrix()
        searchShortestRoute()
    }
}

