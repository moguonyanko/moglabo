package exercise.function.util;

import java.util.function.Predicate;
import java.util.stream.IntStream;
import java.util.stream.Stream;

/**
 * 参考：
 * 「アルゴリズムとデータ構造」(SoftbankCreative)
 */
public class Grapher {

	private static class MinElement {

		private final int index;
		private int cost;

		public MinElement(int index, int cost) {
			this.index = index;
			this.cost = cost;
		}

		public void setCost(int cost) {
			this.cost = cost;
		}

	}

	/**
	 * ダイクストラ法による経路探索を行う。
	 * グラフは隣接行列として表現している。
	 *
	 * @todo
	 * 経路を返していない。
	 * 
	 * IntStreamを使い過ぎでは。型がIntegerに固定されるので
	 * mapを適用しにくくなってしまう。
	 *
	 */
	public static int[] routeSearch(final int[][] graph, final int startIndex) {
		int elementSize = graph.length;
		final int[] currentCost = new int[elementSize];
		boolean[] fix = new boolean[elementSize];
		int defaultMinCost = -1;

		IntStream.range(0, elementSize)
			.forEach(idx -> {
				currentCost[idx] = defaultMinCost;
				fix[idx] = false;
			});

		currentCost[startIndex] = 0;

		while (true) {
			int minElement = IntStream.range(0, elementSize)
				.filter(i -> !fix[i] && currentCost[i] != -1)
				.reduce((element, nextElement)
					-> currentCost[element] > currentCost[nextElement]
					? nextElement : element)
				.orElse(Integer.MIN_VALUE);
			int minCost = minElement > Integer.MIN_VALUE
				? currentCost[minElement] : defaultMinCost;

			if (minCost == defaultMinCost) {
				break;
			}
			
			IntStream.range(0, elementSize)
				.filter(i -> !fix[i] && graph[minElement][i] > 0)
				.forEach(element -> {
					int newCost = minCost + graph[minElement][element];

					if (currentCost[element] == -1 || currentCost[element] > newCost) {
						currentCost[element] = newCost;
					}
				});

			fix[minElement] = true;
		}

		return currentCost;
	}

	public static int[] routeSearch(final int[][] graph) {
		return routeSearch(graph, 0);
	}

}
