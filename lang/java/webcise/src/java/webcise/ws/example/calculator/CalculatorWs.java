package webcise.ws.example.calculator;

import javax.jws.WebService;

@WebService(targetNamespace = "http://localhost/wsdl")
public interface CalculatorWs {
	
	public int sum(int add1, int add2);
	
	public int multiply(int mul1, int mul2);
	
}
