package moglabo.practicejava.mcp;

import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;

//@SpringBootApplication
public class MyMcpServerApplication {

	public static void main(String[] args) {
//		SpringApplication.run(MyMcpServerApplication.class, args);
	}

	@Bean
	public ToolCallbackProvider weatherTools(MyWeatherService weatherService) {
		return  MethodToolCallbackProvider.builder().toolObjects(weatherService).build();
	}
}
