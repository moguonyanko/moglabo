package test.exercise.function.dod;

import exercise.function.dod.BoardFactory;
import java.util.ArrayList;
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
	public void boardArrayでリスト表現のゲーム盤を配列表現に変換できる() {
		List<Integer> l1 = new ArrayList<>();
		l1.add(0);
		l1.add(3);
		List<Integer> l2 = new ArrayList<>();
		l2.add(0);
		l2.add(3);
		List<Integer> l3 = new ArrayList<>();
		l3.add(1);
		l3.add(3);
		List<Integer> l4 = new ArrayList<>();
		l4.add(1);
		l4.add(1);

		List<List<Integer>> lst = new ArrayList<>();
		lst.add(l1);
		lst.add(l2);
		lst.add(l3);
		lst.add(l4);

		int[][] expected = {
			{0, 3},
			{0, 3},
			{1, 3},
			{1, 1}
		};

		int[][] actual = BoardFactory.boardArray(lst);

		assertThat(actual, is(expected));
	}

}
