package practicejsf.bean;

import javax.faces.bean.ManagedBean;

@ManagedBean
public class CalculatorBean<T extends Number> {

	private int firstNumber;
	private int secondNumber;

	public int getFirstNumber() {
		return firstNumber;
	}

	public void setFirstNumber(int firstNumber) {
		this.firstNumber = firstNumber;
	}

	public int getSecondNumber() {
		return secondNumber;
	}

	public void setSecondNumber(int secondNumber) {
		this.secondNumber = secondNumber;
	}

	public int getSum() {
		return firstNumber + secondNumber;
	}

	public String computeSum() {
		return "show-sum";
	}

}
