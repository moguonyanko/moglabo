package exercise.function.dod;

import java.util.List;
import java.util.Objects;

public class GameTree {
	
	private final List<Move> moves;

	public GameTree(List<Move> moves) {
		this.moves = moves;
	}

	public final List<Move> getMoves() {
		return moves;
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof GameTree){
			GameTree other = (GameTree)obj;
			return moves.equals(other.moves);
		}
		
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(moves);
	}
	
}
