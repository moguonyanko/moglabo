package webcise.ws.example.calculator;

import javax.ejb.Stateless;
import javax.jws.WebService;

@Stateless
@WebService(
	portName = "CalculatorPort",
	serviceName = "CalculatorService",
	targetNamespace = "http://localhost/wsdl",
	endpointInterface = "webcise.ws.example.calculator.CalculatorWs")
public class Calculator implements CalculatorWs {

	@Override
	public int sum(int add1, int add2) {
		return 0;
	}

	@Override
	public int multiply(int mul1, int mul2) {
		return 0;
	}

}
