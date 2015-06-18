package exercise.function.dod;

import java.util.List;
import static java.util.stream.Collectors.*;

public class DodUtils {

	public static List<BoardCell> boardArray(List<List<Integer>> boardExpressions) {
		return boardExpressions.stream()
			.map(BoardCell::new)
			.collect(toList());
	}

	public static String playerLetter(Player player){
		return Character.toString((char)(97 + player.getPalyerNo()));
	}
	
}
