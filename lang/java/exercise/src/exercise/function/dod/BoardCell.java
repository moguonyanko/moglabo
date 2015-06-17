package exercise.function.dod;

import java.util.List;
import java.util.Objects;

public class BoardCell {

	private final int x;
	private final int y;

	public BoardCell(int x, int y) {
		this.x = x;
		this.y = y;
	}

	public BoardCell(List<Integer> nums) {
		if (nums.size() < 2) {
			throw new IllegalArgumentException("Board cell is need two numbers.");
		}

		this.x = nums.get(0);
		this.y = nums.get(1);
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof BoardCell) {
			BoardCell other = (BoardCell) obj;
			return x == other.x && y == other.y;
		}

		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(x, y);
	}

}
