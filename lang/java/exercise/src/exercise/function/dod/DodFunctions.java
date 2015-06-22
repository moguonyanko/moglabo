package exercise.function.dod;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import static java.util.stream.Collectors.*;

public class DodFunctions {

	public static List<Hex> boardArray(List<List<Integer>> boardExpressions) {
		return boardExpressions.stream()
			.map(Hex::new)
			.collect(toList());
	}

	public static String playerLetter(Player player){
		return Character.toString((char)(97 + player.getPalyerNo()));
	}
	
	private static Player nextPlayer(Player nowPlayer){
		int nextPlayerNo = (nowPlayer.getPalyerNo() + 1) % DodParameter.NUM_PLAYERS;
		return new Player(nextPlayerNo);
	}
	
	private static List<Move> attackingMoves(Board board, Player currentPlayer, 
		int spareDice){
		Function<Integer, Player> getPlayer = 
			pos -> board.getHex(pos).getPlayer();
		Function<Integer, Integer> getDiseSize = 
			pos -> board.getHex(pos).getDiceSize();
		
		
		/**
		 * @todo
		 * implement
		 */
		
		return null;
	}
	
	private static Board addNewDice(Board board, Player player, int spareDice){
		/**
		 * @todo
		 * implement
		 */
		
		return null;
	}
	
	private static List<GameTree> addPassinggMove(Board board, Player player, int spareDice, 
		boolean firstMove, List<GameTree> moves){
		
		if(firstMove){
			return moves;
		}else{
			List<GameTree> newMoves = new ArrayList<>();
			newMoves.add(null);
			Board newBoard = addNewDice(board, player, spareDice - 1);
			Player nextPlayer = nextPlayer(player);
			GameTree gameTree = gameTree(newBoard, nextPlayer, 0, true);
			newMoves.add(gameTree);
			newMoves.addAll(moves);
			return newMoves;
		}
	}
	
	/**
	 * 
	 * @param board
	 * @param player
	 * @param spareDice
	 * @param firstMove
	 * @return 
	 */
	public static GameTree gameTree(Board board, Player player, int spareDice, 
		boolean firstMove){
		
		/**
		 * @todo
		 * implement
		 */
		
		return null;
	}
	
}
