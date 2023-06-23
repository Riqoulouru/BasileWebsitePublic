package basile.newcv.repository;

import basile.newcv.entity.IpAdress;
import basile.newcv.entity.NumericPadScore;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Set;

public interface NumericPadScoreRepository extends CrudRepository<NumericPadScore, Long> {

    NumericPadScore findByUsername(String username);

    Iterable<NumericPadScore> findAllByOrderByScoreDesc();

}

