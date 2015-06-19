package exercise.function.dod;

import java.util.List;
import java.util.Objects;

public class Board {

	private final List<Hex> hexes;

	public Board(List<Hex> cells) {
		this.hexes = cells;
	}

	public Hex getHex(int index){
		return hexes.get(index);
	}
	
	@Override
	public String toString() {
		StringBuilder s = new StringBuilder();
		hexes.stream().forEach(cell -> s.append(cell.toString()));
		return s.toString();
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Board){
			Board other = (Board)obj;
			return hexes.equals(other.hexes);
		}
		
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(hexes);
	}
	
}
