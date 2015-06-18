package exercise.function.dod;

import java.util.Objects;

public class Player {

	private final int palyerNo;

	public Player(int palyerNo) {
		this.palyerNo = palyerNo;
	}

	public final int getPalyerNo() {
		return palyerNo;
	}

	@Override
	public String toString() {
		return String.valueOf(palyerNo);
	}

	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Player){
			Player other = (Player)obj;
			return palyerNo == other.palyerNo;
		}
		
		return false;
	}

	@Override
	public int hashCode() {
		return Objects.hash(palyerNo);
	}
	
}
