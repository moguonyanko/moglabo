package test.exercise.lang;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.junit.Test;
import org.junit.Assert;

public class TestSort {
	
	private static final int SORT_TARGET_VALUES_SIZE = 256;

	@Test
	public void sortの互換性をテストする_Arrays(){
		Integer[] sample = new Integer[SORT_TARGET_VALUES_SIZE];
		Integer[] expected = new Integer[SORT_TARGET_VALUES_SIZE];
		for(int i = 0; i < SORT_TARGET_VALUES_SIZE;){
			sample[i] = i;
			expected[i] = SORT_TARGET_VALUES_SIZE - ++i;
		}
		
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
		Integer[] srcSample = new Integer[SORT_TARGET_VALUES_SIZE];
		Integer[] srcExpected = new Integer[SORT_TARGET_VALUES_SIZE];
		for(int i = 0; i < SORT_TARGET_VALUES_SIZE;){
			srcSample[i] = i;
			srcExpected[i] = SORT_TARGET_VALUES_SIZE - ++i;
		}
		
		List<Integer> sample = Arrays.asList(srcSample);
		List<Integer> expected = Arrays.asList(srcExpected);
		
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
