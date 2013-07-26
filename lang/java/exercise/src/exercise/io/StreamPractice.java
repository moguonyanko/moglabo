package exercise.io;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.nio.file.StandardOpenOption.*;

public class StreamPractice {
	public static void main(String[] args){
		Path logPath = Paths.get("../../../sample/sample4.log");
		
		String text = "This is test log!\n";
		byte[] datas = text.getBytes();
		
//		try(OutputStream out = new BufferedOutputStream(Files.newOutputStream(
//			logPath, CREATE, APPEND))){
		
//		try(OutputStream out = new BufferedOutputStream(Files.newOutputStream(
//			logPath, CREATE_NEW))){
		
		/* nonsense */
//		try(OutputStream out = new BufferedOutputStream(Files.newOutputStream(
//			logPath, CREATE_NEW, APPEND))){

		try(OutputStream out = new BufferedOutputStream(Files.newOutputStream(
			logPath, APPEND, TRUNCATE_EXISTING))){

//		try(OutputStream out = new BufferedOutputStream(Files.newOutputStream(
//			logPath, CREATE, WRITE, TRUNCATE_EXISTING, SYNC))){

//		try(OutputStream out = new BufferedOutputStream(Files.newOutputStream(
//			logPath, CREATE_NEW, DELETE_ON_CLOSE, DSYNC))){
			
			out.write(datas, 0, datas.length);
			
		}catch(IOException ex){
			ex.printStackTrace();
		}
	}
}
