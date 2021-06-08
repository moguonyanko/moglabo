package exercise.io;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public record SampleMember(String name, int age) {

    public void save(ByteBuffer byteBuffer) {
        byteBuffer.put(name.getBytes(StandardCharsets.UTF_8));
        byteBuffer.putInt(age);
    }

    public static SampleMember load(ByteBuffer byteBuffer) {
        var bs = new byte[byteBuffer.remaining()];
        var b = byteBuffer.get(bs);
        var n = StandardCharsets.UTF_8.decode(b).toString();
        var a = byteBuffer.getInt();
        return new SampleMember(n, a);
    }
}
