package exercise.function.util;

import java.util.stream.IntStream;

/**
 * 参考：
 * 「アルゴリズムとデータ構造」(SoftbankCreative) 
 */
public class Grapher {

	/**
	 * ダイクストラ法による経路探索を行う。
	 * グラフは隣接行列として表現している。
	 */
	public static int[] routeSearch(final int[][] graph, final int startIndex){
		int elementSize = graph.length;
		int[] currentCost = new int[elementSize];
		boolean[] fix = new boolean[elementSize];
		
		IntStream.range(0, elementSize)
			.forEach(idx -> {
				currentCost[idx] = -1;
				fix[idx] = false;
			});
		
		currentCost[startIndex] = 0;
		
		while(true){
			int minElement = -1;
			int minCost = -1;
			
			for(int i = 0; i < elementSize; i++){
				if(!fix[i] && currentCost[i] == -1){
					if(minCost == -1 || minCost > currentCost[i]){
						minCost = currentCost[i];
						minElement = i;
					}
				}
			}
			
			if(minCost == -1){
				break;
			}
			
			for(int i = 0; i < elementSize; i++){
				if(!fix[i] && graph[minElement][i] > 0){
					int newCost = minCost + graph[minElement][i];
					
					if(currentCost[i] == -1 || currentCost[i] > newCost){
						currentCost[i] = newCost;
					}
				}
			}
			
			fix[minElement] = true;
		}
		
		return currentCost;
	}
	
}
