/**
 * DOM層
 * CustomElements層(ここ)
 * ECMA層
 */

class SkewingCanvas extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});

        const canvas = document.createElement("canvas");
        const sz = this.size;
        canvas.setAttribute("width", sz.width);
        canvas.setAttribute("height", sz.height);

        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(10, 10, sz.width - 10, sz.height - 10);

        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`約${this.runtime}ms実行します。`));

        shadow.appendChild(canvas);
        shadow.appendChild(p);

        this.skew();
    }

    get size() {
        let w = this.getAttribute("width");
        if (w.includes("vw")) {
            const perW = parseInt(w);
            w = screen.availWidth * (perW / 100);
        }
        const width = parseInt(w);
        const height = parseInt(this.getAttribute("height"));
        return {width, height};
    }

    get runtime() {
        return parseInt(this.getAttribute("runtime"));
    }

    get skewLimit() {
        return {
            horizontal: parseInt(this.getAttribute("horizontalskewlimit")),
            virtical: parseInt(this.getAttribute("virticalskewlimit"))
        };
    }

    skew() {
        let hSkew = 0, vSkew = 0;
        let hDiv = null, vDiv = null;
        let animationReference = null;
        const skewing = async (timestamp, startTime, runTimeLimit) => {
            if (hSkew > this.skewLimit.horizontal) {
                hDiv = -1;
            } else if (hSkew <= 0) {
                hDiv = 1;
            }
            if (vSkew > this.skewLimit.virtical) {
                vDiv = -1;
            } else if (vSkew <= 0) {
                vDiv = 1;
            }
            hSkew += hDiv;
            vSkew += vDiv;
            try {
                await this.trans({hSkew, vSkew});
                let runTime = timestamp - startTime;
                if (runTime < runTimeLimit) {
                    requestAnimationFrame(timestamp => {
                        skewing(timestamp, startTime, runTimeLimit);
                    });
                }
            } catch (err) {
                console.warn(`Animation canceled: ${err.message}`);
                cancelAnimationFrame(animationReference);
            }
        };
        animationReference = requestAnimationFrame(timestamp => {
            const startTime = timestamp || Date.now();
            skewing(timestamp, startTime, this.runtime);
        });
    }

    async trans( {hSkew, vSkew}) {
        //if (hSkew === 7) {
        //    throw new Error("Test error");
        //}
        const sz = this.size;
        this.ctx.clearRect(0, 0, sz.width, sz.height);
        this.ctx.save();

        // 意味のないTensorとVariableのやりとりだが練習のため。
        const t1 = tf.zeros([3, 3]);
        const v1 = tf.variable(t1);
        const t2 = tf.tensor2d([[1, hSkew, vSkew], [1, 0, 0], [0, 0, 1]]);
        const v2 = tf.variable(t2);
        // assignは戻り値なし。v1に副作用を与える。
        v1.assign(v2);
        const [a, b, c, d, e, f] = await v1.data();

        this.ctx.transform(a, b, c, d, e, f);
        this.ctx.fillRect(10, 10, 25, 25);
        this.ctx.restore();
    }
}

const runTest = () => {
    const c = new SkewingCanvas();
    console.log(c);
};

//mv.test.runTest();

const skewing = {
    SkewingCanvas,
    test: {
        runTest
    }
};

export default skewing;
