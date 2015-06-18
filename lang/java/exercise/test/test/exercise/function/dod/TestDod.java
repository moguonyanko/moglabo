package test.exercise.function.dod;

import exercise.function.dod.BoardCell;
import exercise.function.dod.DodUtils;
import exercise.function.dod.Player;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

public class TestDod {

	public TestDod() {
	}

	@BeforeClass
	public static void setUpClass() {
	}

	@AfterClass
	public static void tearDownClass() {
	}

	@Before
	public void setUp() {
	}

	@After
	public void tearDown() {
	}

	@Test
	public void ゲーム盤の元となるリストを得る() {
		List<BoardCell> expected = Arrays.asList(
			new BoardCell(new Player(0), 3),
			new BoardCell(new Player(0), 3),
			new BoardCell(new Player(1), 3),
			new BoardCell(new Player(1), 1)
		);

		List<Integer> l1 = Arrays.asList(0, 3);
		List<Integer> l2 = Arrays.asList(0, 3);
		List<Integer> l3 = Arrays.asList(1, 3);
		List<Integer> l4 = Arrays.asList(1, 1);

		List<List<Integer>> lst = Arrays.asList(
			l1, l2, l3, l4
		);

		List<BoardCell> actual = DodUtils.boardArray(lst);

		assertThat(actual, is(expected));
	}

	@Test
	public void プレイヤーを指す文字列を得る(){
		String expected = "b";
		
		int playerNo = 1;
		Player player = new Player(playerNo);
		
		String actual = DodUtils.playerLetter(player);
		
		assertThat(actual, is(expected));
	}
	
}
