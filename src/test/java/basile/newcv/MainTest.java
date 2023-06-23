package basile.newcv;

import java.io.File;

public class MainTest {

    public static void main(String[] args) {
        File curDir = new File("./src/main/resources/calendar");
        File[] filesList = curDir.listFiles();
        for(File f : filesList){
            if(f.isFile()){
                System.out.println(f.getName());
            }
        }

    }

}
