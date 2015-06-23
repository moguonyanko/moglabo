package exercise.function.dod;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.function.UnaryOperator;
import java.util.Arrays;
import static java.util.stream.Collectors.*;

import static exercise.function.dod.DodParameter.*;
import java.util.function.Predicate;

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
		int nextPlayerNo = (nowPlayer.getPalyerNo() + 1) % NUM_PLAYERS;
		return new Player(nextPlayerNo);
	}
	
	private static List<Integer> neightbors(int pos){
		UnaryOperator<Integer> up = p -> p - BOARD_SIZE;
		UnaryOperator<Integer> down = p -> p + BOARD_SIZE;
		Predicate<Integer> notRightBound = p -> p % BOARD_SIZE != 0;
		Predicate<Integer> notLeftBound = p -> (p + 1) % BOARD_SIZE != 0;
		
		/**
		 * Arrays.asListが返すListはaddをサポートしない。
		 */
		List<Integer> positions = new ArrayList<>();
		
		positions.addAll(Arrays.asList(
			up.apply(pos), down.apply(pos)
		));
		
		if(notRightBound.test(pos)){
			positions.addAll(Arrays.asList(
				up.apply(pos - 1), pos - 1
			));
		}
		
		if(notLeftBound.test(pos)){
			positions.addAll(Arrays.asList(
				pos + 1, down.apply(pos + 1)
			));
		}
		
		return positions.stream()
			.filter(p -> 0 <= p && p < BOARD_HEXNUM)
			.collect(toList());
	}
	
	private static List<Move> attackingMoves(Board board, Player currentPlayer, 
		int spareDice){
		Function<Integer, Player> getPlayer = 
			pos -> board.getHex(pos).getPlayer();
		Function<Integer, Integer> getDiseSize = 
			pos -> board.getHex(pos).getDiceSize();
		
		throw new UnsupportedOperationException("not implement");
	}
	
	private static Board addNewDice(Board board, Player player, int spareDice){
		throw new UnsupportedOperationException("not implement");
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
		throw new UnsupportedOperationException("not implement");
	}

	/**
	 * privateメソッドの動作確認を行う。
	 */
	public static void main(String[] args) {
		System.out.println(DodFunctions.neightbors(2));
	}
	
}
