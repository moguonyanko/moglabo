#!/usr/local/bin/node

var c = require('../common.js');

function LinkedListNode(data, next, prev) {
	this.data = data;
	this.next = next;
	this.prev = prev;
}

LinkedListNode.prototype = {
	toString: function () {
		return this.data.toString();
	},
	dump: function () {
		var head = this.getHead(),
			content = [];

		while (head.next) {
			content.push(head.toString());
			head = head.next;
		}

		content.push(head.toString());
		
		return content.join('');
	},
	getHead: function () {
		var node = this;

		while (node.prev) {
			node = node.prev;
		}

		return node;
	},
	getTail: function () {
		var node = this;

		while (node.next) {
			node = node.next;
		}

		return node;
	}
};


function makeLinkedList(datas) {
	var listSize = datas.length;
	
	if (listSize <= 0) {
		return null;
	}

	var current = null;

	for (var dataIdx = 0; dataIdx < listSize; dataIdx++) {
		var data = datas[dataIdx],
			node = new LinkedListNode(data, null, null);

		if (current) {
			node.prev = current;
			current.next = node;
		}

		current = node;
	}

	return current.getHead();
}

module.exports = {
	LinkedListNode: LinkedListNode,
	makeLinkedList: makeLinkedList
};
