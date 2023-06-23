package basile.newcv.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class NumericPadScore {

    @Id
    private String username;

    private int score;

    public NumericPadScore(String username, int score) {
        this.username = username;
        this.score = score;
    }

    public NumericPadScore() {

    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
