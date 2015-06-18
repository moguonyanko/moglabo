package exercise.function.dod;

import java.util.List;
import java.util.Objects;

public class Board {

	private final List<BoardCell> cells;

	public Board(List<BoardCell> cells) {
		this.cells = cells;
	}

	@Override
	public String toString() {
		StringBuilder s = new StringBuilder();
		cells.stream().forEach(cell -> s.append(cell.toString()));
		return s.toString();
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Board){
			Board other = (Board)obj;
			return cells.equals(other.cells);
		}
		
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(cells);
	}
	
}
