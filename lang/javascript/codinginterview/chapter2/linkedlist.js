(function (win, doc, g) {
	'use strict';

	function LinkedListNode(data, next, prev) {
		this.data = data;
		this.next = next;
		this.prev = prev;
	}

	LinkedListNode.prototype = {
		toString: function () {
			return this.dump();
		},
		dump: function () {
			var head = this.getHead(),
				content = [];

			while (head.next) {
				content.push(head.data.toString());
				head = head.next;
			}

			content.push(head.data.toString());

			return content.join(',');
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
		},
		equals: function (other) {
			if (!other) {
				return false;
			}

			if (!(other instanceof LinkedListNode)) {
				return false;
			}

			var self = this,
				another = other;

			while (self && another) {
				if (self.data !== another.data) {
					return false;
				}
				
				self = self.next;
				another = another.next;
			}

			return !self && !another;
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

	g.linkedlist = {
		LinkedListNode: LinkedListNode,
		makeLinkedList: makeLinkedList
	};
}(window, document, gomapre));
