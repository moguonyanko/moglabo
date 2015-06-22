package exercise.function.dod;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

import static exercise.function.dod.DodParameter.*;

/**
 * 参考：「Land of Lisp」(オライリー・ジャパン)
 */
public class DodMain {

	private static Board genBoard(){
		List<List<Integer>> boards = new ArrayList<>();
		
		for(int i = 0; i < BOARD_HEXNUM; i++){
			Random rand = new Random();
			List<Integer> board = Arrays.asList(
				rand.nextInt(NUM_PLAYERS), 
				rand.nextInt(MAX_DICE + 1)
			);
			boards.add(board);
		}
		
		return new Board(DodFunctions.boardArray(boards));
	}
	
	private static void drawBoard(Board board){
		for(int y = 0; y < BOARD_SIZE; y++){
			int tmp = y;
			while((BOARD_SIZE - tmp) > 0){
				System.out.print(" ");
				tmp++;
			}
			
			for(int x = 0; x < BOARD_SIZE; x++){
				int position = x + (BOARD_SIZE * y);
				Hex hex = board.getHex(position);
				String hexInfo = String.format("%s-%s ", 
					DodFunctions.playerLetter(hex.getPlayer()), hex.getDiceSize());
				System.out.print(hexInfo);
			}
			
			System.out.println("");
		}
	}
	
	public static void main(String[] args) {
		Board board = genBoard();
		drawBoard(board);
	}
	
}
