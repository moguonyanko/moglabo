package exercise.concurrent.philosophers;

import java.util.ArrayList;
import java.util.List;

public class DiningTable implements Diningware{
	
	private final List<Tableware> wares = new ArrayList<>();

	public DiningTable(int wareSize) {
		for(int wareIdx = 0; wareIdx < wareSize; wareIdx++){
			wares.add(Tableware.FORK);
		}
	}
	
	@Override
	public int usableWareCount() {
		int count = 0;
		
		for(Tableware ware : wares){
			if(!ware.isInUse()){
				count++;
			}
		}
		
		return count;
	}

	@Override
	public int totalWareCount() {
		return wares.size();
	}
	
}
