package basile.newcv.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class IpAdress {
    @Id
    @GeneratedValue
    private Long id;
    @Column
    private String ipAdress;
    @Column
    private int connectionNumber;
    @Column
    private String locatedCountry;
    @Column
    private long userId;

    public IpAdress() {
        super();
    }


    public IpAdress(String ipAdress, int connectionNumber, String locatedCountry, long userId) {
        this.ipAdress = ipAdress;
        this.connectionNumber = connectionNumber;
        this.locatedCountry = locatedCountry;
        this.userId = userId;
    }

    public IpAdress(String ipAdress, int connectionNumber, String locatedCountry) {
        this.ipAdress = ipAdress;
        this.connectionNumber = connectionNumber;
        this.locatedCountry = locatedCountry;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getIpAdress() {
        return ipAdress;
    }

    public void setIpAdress(String ipAdress) {
        this.ipAdress = ipAdress;
    }

    public int getConnectionNumber() {
        return connectionNumber;
    }

    public void setConnectionNumber(int connectionNumber) {
        this.connectionNumber = connectionNumber;
    }

    public String getLocatedCountry() {
        return locatedCountry;
    }

    public void setLocatedCountry(String locatedCountry) {
        this.locatedCountry = locatedCountry;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
