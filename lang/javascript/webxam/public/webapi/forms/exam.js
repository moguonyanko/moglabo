/**
 * @fileoverview Form関連調査用スクリプト
 */

// DOM

const getFormOutput = formId =>
    document.querySelector(`output[form='${formId}']`);

const listeners = {
    dispatchSubmit(formId) {
        const output = getFormOutput(formId);
        try {
            const form = document.querySelector(`form[id='${formId}']`);
            // requestSubmit呼び出しでsubmitイベントを発生させる。
            // submitと異なりrequestSubmitではフォーム入力内容のバリデーションが実施される。
            form.requestSubmit();
        } catch (error) {
            output.innerHTML += `${error.message}<br />`;
        }
    }
};

// Arrow Functionはbindを経由して呼び出された場合でもthisがundefinedになる。
// http://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions-runtime-semantics-evaluation
const onSubmit = form => {
    const output = getFormOutput(form.id);
    const values = Array.from(form.querySelectorAll('input'))
        .filter(input => input.checked)
        .map(input => input.value);
    output.innerHTML += `Dispatch Submit Event: ${values}<br />`;
};

window.addEventListener('pointerup', event => {
    const et = event.target.dataset.eventTarget;
    if (!et) {
        return;
    }
    event.stopPropagation();
    listeners[et](event.target.value);
});

// form.requestSubmit経由で呼び出すイベントリスナーの登録
window.addEventListener('submit', event => {
    if (event.target instanceof HTMLFormElement) {
        event.stopPropagation();
        // ページのリロード防止
        event.preventDefault();
        onSubmit(event.target);
    }
}, { passive: false });
