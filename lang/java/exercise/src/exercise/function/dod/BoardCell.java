package exercise.function.dod;

import java.util.List;
import java.util.Objects;

public class BoardCell {

	private final Player player;
	private final int diceSize;

	public BoardCell(Player player, int diceSize) {
		this.player = player;
		this.diceSize = diceSize;
	}

	public BoardCell(List<Integer> nums) {
		if (nums.size() < 2) {
			throw new IllegalArgumentException("Board cell is need two numbers.");
		}

		this.player = new Player(nums.get(0));
		this.diceSize = nums.get(1);
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof BoardCell) {
			BoardCell other = (BoardCell) obj;
			return player.equals(other.player) && diceSize == other.diceSize;
		}

		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(player, diceSize);
	}

	@Override
	public String toString() {
		return "(player=" + player + ",dice size=" + diceSize + ")";
	}

}
