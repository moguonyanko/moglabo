/**
 * @fileoverview Payment Request API調査用スクリプト
 */

// DOM

const defaultSupportedInstruments = [{
  supportedMethods: 'basic-card',
  data: {
    supportedNetworks: ['visa', 'mastercard'],
    supportedTypes: ['debit', 'credit']
  }
}];

const sampleDetails = {
  total: {
    label: 'サンプルアイテム合計',
    amount: { currency: 'JPY', value: '1000' }
  },
  displayItems: [{
    label: 'サンプルアイテム',
    amount: { currency: 'JPY', value: '1000' }
  }],
  shippingOptions: [{
    id: 'samplerequest',
    label: 'Sample Shipping',
    amount: { currency: 'JPY', value: '0' },
    selected: true
  }]
};

const sampleOptions = {
  requestPayerName: true,
  requestPayerEmail: true,
  requestPayerPhone: false,
  requestShipping: true,
  shippingType: 'delivery'
};

const listeners = {
  async createSampleRequest() {
    const request =
      new PaymentRequest(defaultSupportedInstruments, sampleDetails, sampleOptions);
    const output = document.querySelector('.output.createsamplerequest');
    try {
      const instrumentResponse = await request.show();
      instrumentResponse.complete('取引成功');
      output.innerHTML += `${JSON.stringify(instrumentResponse.details)}<br />`;
    } catch (err) {
      output.innerHTML += `${err.message}<br />`;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('main').addEventListener('pointerup', async e => {
    const et = e.target.dataset.eventTarget;
    if (!et || typeof listeners[et] !== 'function') {
      return;
    }
    e.stopPropagation();
    await listeners[et]();
  });
});
