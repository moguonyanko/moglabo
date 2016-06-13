package practicejsf.bean;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.faces.bean.ManagedBean;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import practicejsf.util.Faces;

@ManagedBean
public class SearchController {

	private String searchString = "";
	private SearchEngine searchEngine;

	public enum SearchEngine {

		GOOGLE("Google", "https://www.google.co.jp/search?q="),
		DUCKDUCKGO("DuckDuckGo", "https://duckduckgo.com/?q="),
		BING("Bing", "https://www.bing.com/search?q=");

		private final String displayName;
		private final String searchURL;

		private SearchEngine(String displayName, String searchURL) {
			this.displayName = displayName;
			this.searchURL = searchURL;
		}

		public String getDisplayName() {
			return displayName;
		}

		public String getSearchURL() {
			return searchURL;
		}
		
		@Override
		public String toString() {
			return name().toUpperCase();
		}

	}
	
	public String getSearchString() {
		return searchString;
	}

	public void setSearchString(String searchString) {
		this.searchString = searchString.trim();
	}

	public SearchEngine getSearchEngine() {
		return searchEngine;
	}

	public void setSearchEngine(SearchEngine searchEngine) {
		this.searchEngine = searchEngine;
	}
	
	public List<String> getAvailableSearchEngineNames() {
		return Stream.of(SearchEngine.values())
			.map(engine -> engine.getDisplayName())
			.collect(Collectors.toList());
	}

	public List<SearchEngine> getAvailableSearchEngines() {
		return Stream.of(SearchEngine.values())
			.collect(Collectors.toList());
	}
	
	public void doSearch() throws IOException {
		if(Faces.isNullOrEmpty(searchString) || searchEngine == null){
			return;
		}
		
		ExternalContext context = FacesContext.getCurrentInstance().getExternalContext();
		HttpServletRequest request = (HttpServletRequest)context.getRequest();
		searchString = URLEncoder.encode(searchString, request.getCharacterEncoding());
		String targetURL = searchEngine.getSearchURL() + searchString;
		HttpServletResponse response = (HttpServletResponse)context.getResponse();
		response.sendRedirect(targetURL);
	}
	
}
