package exercise.function.dod;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * 参考：「Land of Lisp」(オライリー・ジャパン)
 */
public class DodMain {

	private static Board genBoard(){
		List<List<Integer>> boards = new ArrayList<>();
		
		for(int i = 0; i < DodParameter.BOARD_HEXNUM; i++){
			Random rand = new Random();
			List<Integer> board = Arrays.asList(
				rand.nextInt(DodParameter.NUM_PLAYERS), 
				rand.nextInt(DodParameter.MAX_DICE + 1)
			);
			boards.add(board);
		}
		
		return new Board(DodUtils.boardArray(boards));
	}
	
	public static void main(String[] args) {
		System.out.println(genBoard());
	}
	
}
