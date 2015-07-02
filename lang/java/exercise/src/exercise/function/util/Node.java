package exercise.function.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Node {

	private final List<Node> nodes;
	private NodeColor color = NodeColor.WHITE;

	public Node(List<Node> nodes) {
		this.nodes = nodes;
	}

	public Node() {
		this(new ArrayList<>());
	}

	public NodeColor getColor() {
		return color;
	}

	public void setColor(NodeColor color) {
		this.color = color;
	}

	public void setAllColors(NodeColor color) {
		setColor(color);
		nodes.stream().forEach(node -> node.setColor(color));
	}

	public List<Node> getNodes() {
		return nodes;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (obj instanceof Node) {
			Node other = (Node) obj;

			if (color != other.color) {
				return false;
			}

			return other.nodes.stream()
				.allMatch(node -> other.equals(node));
		} else {
			return false;
		}
	}

	@Override
	public int hashCode() {
		return Objects.hash(nodes, color);
	}

}
