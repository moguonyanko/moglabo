package practicejsf.bean;

import java.util.Date;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;

@ManagedBean(name = "book", eager = true)
@RequestScoped
public class Book {

	/**
	 * ManagedPropertyが指定されていなくてもbook.priceのように
	 * JSFを利用するページからアクセスすることはできる。
	 */
	private int price;
	
	private Date publication = new Date();

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public Date getPublication() {
		return publication;
	}

	public void setPublication(Date publication) {
		this.publication = publication;
	}
	
}
