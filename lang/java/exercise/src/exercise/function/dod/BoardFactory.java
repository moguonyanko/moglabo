package exercise.function.dod;

import java.util.List;
import static java.util.stream.Collectors.*;

public class BoardFactory {

	public static List<BoardCell> boardArray(List<List<Integer>> boardExpressions) {
		return boardExpressions.stream()
			.map(BoardCell::new)
			.collect(toList());
	}

}
