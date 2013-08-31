package exercise.concurrent.philosophers;

public enum Tableware {
	
	FORK;
	
	private boolean inUse;
	
	boolean isInUse(){
		return inUse;
	}
	
	void setInUse(boolean inUse){
		this.inUse = inUse;
	}
}
