package myservicemodule.tools;

public class SamplePen implements Pen {
    @Override
    public void write() {
        System.out.println("Write text by my sample pen");
    }

    private void secretWrite() {
        System.out.println("Write secret text");
    }

}
