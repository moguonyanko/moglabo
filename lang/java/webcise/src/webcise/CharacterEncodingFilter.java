package webcise;

import java.io.IOException;

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebInitParam;

@WebFilter(filterName = "CharacterEncodingFilter", urlPatterns = {"/*"}, 
	dispatcherTypes = {DispatcherType.REQUEST, DispatcherType.FORWARD, 
		DispatcherType.ERROR, DispatcherType.INCLUDE}, 
	initParams = { @WebInitParam(name = "charset", value = "UTF-8") })
public class CharacterEncodingFilter implements Filter {

	private FilterConfig filterConfig = null;

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
		FilterChain chain) throws IOException, ServletException {
		String charset = filterConfig.getInitParameter("charset");
		response.setCharacterEncoding(charset);
		chain.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
	}

	@Override
	public void destroy() {
		/* Does nothing. */
	}

}
