package test.exercise.lang;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.junit.Test;
import org.junit.Assert;
import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.is;

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
	
	@Test
	public void 不可解なコンパレータの挙動を調べる(){
		Integer[] actual = {3, 1, 4, 1, 5, 9};
		//Integer[] expected = Arrays.copyOf(actual, actual.length);
		Integer[] expected = {1, 1, 3, 4, 5, 9};
		
		Arrays.sort(actual, new Comparator<Integer>() {
			@Override
			public int compare(Integer i1, Integer i2) {
				return i1 < i2 ? -1 : (i2 > i1 ? 1 : 0);
			}
		});		
		//Arrays.sort(actual, (Integer i1, Integer i2) -> i1 < i2 ? -1 : (i2 > i1 ? 1 : 0));
		
		assertThat(Arrays.toString(actual), is(Arrays.toString(expected)));
	}
	
}
