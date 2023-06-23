package basile.newcv.DTO;

public class FilmEtatDTO {

    String title;

    String etat;

    public FilmEtatDTO(String title, String etat) {
        this.title = title;
        this.etat = etat;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
