package test.exercise.lang;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.junit.Test;
import org.junit.Assert;

public class TestSort {
	
	@Test
	public void sortの互換性をテストする_Arrays(){
		Integer[] sample = new Integer[]{1, 2, 3, 4, 5};
		Integer[] expected = new Integer[]{5, 4, 3, 2, 1};
		
		Arrays.sort(sample, new Comparator<Integer>() {
			@Override
			public int compare(Integer o1, Integer o2) {
				return -1;
			}
		});
		/* Java8では以下と同じ */
		//Arrays.sort(sample, (x, y) -> -1);
		
		Assert.assertArrayEquals(expected, sample);
		//assertThat(sample, is(expected));
	}
	
	@Test
	public void sortの互換性をテストする_Collections(){
		List<Integer> sample = Arrays.asList(new Integer[]{1, 2, 3, 4, 5});
		List<Integer> expected = Arrays.asList(new Integer[]{5, 4, 3, 2, 1});
		
		Collections.sort(sample, new Comparator<Integer>() {
			@Override
			public int compare(Integer o1, Integer o2) {
				return -1;
			}
		});
		/* Java8では以下と同じ */
		//Collections.sort(sample, (x, y) -> -1);
		
		Assert.assertEquals(expected, sample);
		//assertThat(sample, is(expected));
	}
	
}
