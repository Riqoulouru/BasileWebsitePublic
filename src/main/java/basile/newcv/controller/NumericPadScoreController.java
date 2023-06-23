package basile.newcv.controller;

import basile.newcv.entity.NumericPadScore;
import basile.newcv.repository.NumericPadScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/numericPadScore")
public class NumericPadScoreController {

    @Autowired
    UserController userController;

    @Autowired
    NumericPadScoreRepository numericPadScoreRepository;

    @PostMapping({"/saveScore"})
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<?> saveScore(@RequestBody Map<String,?> scoreMap) {
        String username = null;
        int score = 0;
        try {
            username = (String) scoreMap.get("username");
            score = (int) scoreMap.get("score");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("username or score is null");
        }


        if (numericPadScoreRepository.findByUsername(username) == null) {
            numericPadScoreRepository.save(new NumericPadScore(username, score));
        } else {
            if (numericPadScoreRepository.findByUsername(username).getScore() < score) {
                NumericPadScore numericPadScore = numericPadScoreRepository.findByUsername(username);
                numericPadScore.setScore(score);
                numericPadScoreRepository.save(numericPadScore);
            }
        }

        return ResponseEntity.ok("score saved");

    }

    @GetMapping("/leaderboard")
    @PreAuthorize("hasRole('User')")
    public Iterable<NumericPadScore> leaderboard() {
        return numericPadScoreRepository.findAllByOrderByScoreDesc();
    }

}
