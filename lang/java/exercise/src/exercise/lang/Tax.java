package exercise.lang;

public interface Tax {
	double getRate();
	
	default int on(Amount amount){
		return (int)(amount.getAmount() * (1 + getRate()));
	}
}
