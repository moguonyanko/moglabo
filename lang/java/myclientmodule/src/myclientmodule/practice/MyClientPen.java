package myclientmodule.practice;

import myservicemodule.tools.Pen;

public class MyClientPen implements Pen {

    @Override
    public void write() {
        System.out.println("Write by my client pen!");
    }

    public static void main(String[] args) {
        Pen pen = new MyClientPen();
        pen.write();
    }
}
