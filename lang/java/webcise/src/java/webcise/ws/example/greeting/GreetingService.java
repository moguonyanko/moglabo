package webcise.ws.example.greeting;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

@Path("/greeting")
public class GreetingService {
	
	@GET
	public String message(){
		return "Hello, REST!";
	}
	
	@POST
	public String lowerCase(final String message){
		return "Hello, REST!".toLowerCase();
	}
}
