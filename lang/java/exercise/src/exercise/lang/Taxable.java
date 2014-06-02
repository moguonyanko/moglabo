package exercise.lang;

public interface Taxable {
	default int getAmount(){
		return 0;
	}
}
