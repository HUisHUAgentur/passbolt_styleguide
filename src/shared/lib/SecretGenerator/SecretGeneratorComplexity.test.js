/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.3.0
 */
import {SecretGeneratorComplexity} from "./SecretGeneratorComplexity";

describe.only("SecretGeneratorComplexity", () => {

    /**
     * To ensure the test is a bit more relevant, the results to compare with are taken from https://www.omnicalculator.com/other/password-entropy
     */
    it("should calculate the right entropy for a given set of length and maskSize", () => {
        const entropyOf = (length, maskSize) => roundEntropy(SecretGeneratorComplexity.calculEntropy(length, maskSize));

        expect(entropyOf(1,1)).toBe(0);
        expect(entropyOf(5,16)).toBe(20);
        expect(entropyOf(10,26)).toBe(47);
        expect(entropyOf(20,52)).toBe(114.01);
        expect(entropyOf(50,198)).toBe(381.47);
    });

    it("should not calculate entropy if one od length or maskSize is 0", () => {
        const entropyOf = (length, maskSize) => roundEntropy(SecretGeneratorComplexity.calculEntropy(length, maskSize));;

        expect(entropyOf(0, 1)).toBe(0);
        expect(entropyOf(1, 0)).toBe(0);
        expect(entropyOf(0, 0)).toBe(0);
    });

    it("evaluates the right strength based on the given entropy", () => {
        const strengthOf = (entropy) => SecretGeneratorComplexity.strength(entropy).id;

        expect(strengthOf(0)).toBe("not_available");

        expect(strengthOf(1)).toBe("very-weak");
        expect(strengthOf(30)).toBe("very-weak");

        expect(strengthOf(60)).toBe("weak");
        expect(strengthOf(70)).toBe("weak");

        expect(strengthOf(80)).toBe("fair");
        expect(strengthOf(100)).toBe("fair");

        expect(strengthOf(112)).toBe("strong");
        expect(strengthOf(120)).toBe("strong");

        expect(strengthOf(128)).toBe("very-strong");
        expect(strengthOf(256)).toBe("very-strong");
    });

    it("should compute the right entropy given a password", () => {
        const passwordsAndEntropy = {
            "aaaaaa": 28.2,
            "AAAAAA": 28.2,
            "111111": 19.93,
            "((((((": 13.93,
            "#$%&@^~": 19.65,
            ".,:;": 8,
            "<*+!?=": 15.51,
            "aaaAAA1111": 59.54,
        };

        for (let password in passwordsAndEntropy) {
            let roundedEntropy = roundEntropy(SecretGeneratorComplexity.entropyPassword(password));
            expect(roundedEntropy).toBe(passwordsAndEntropy[password]);
        }
    });
    
    //It is skipped for the moment as entropy computation with emoji is buggy.
    //This should be part of the previous unit test but to avoid to skip all the password's entropy computation test,
    //it has been splitted this way and marked as skipped.
    //Later, when the bug is fixed, we might include these 2 tests in the previous test and remove this one.
    //Also, the resulting entropy may vary a bit due to float rounding. So, results might need to be adapted a bit (reasonably of course).
    it.skip("should compute the right entropy given a password that includes emojis", () => {
        const passwordsAndEntropy = {
            "🙀🙀🙀🙀🙀🙀": 41.22,
            "aA1(~:<🙀": 61.03,
        };

        for (let password in passwordsAndEntropy) {
            let roundedEntropy = roundEntropy(SecretGeneratorComplexity.entropyPassword(password));
            expect(roundedEntropy).toBe(passwordsAndEntropy[password]);
        }
    });
    
    it("should compute the right entropy given a passphrase", () => {
        const entropyOf = (wordCount, spacing) => roundEntropy(SecretGeneratorComplexity.entropyPassphrase(wordCount, spacing));
        //Currently, the tests are written considering that there are 7776 words in the dictionnary and 3 word cases
        
        expect(entropyOf(5, "")).toBe(64.63);
        expect(entropyOf(5, "  ")).toBe(64.86);
        expect(entropyOf(10, "")).toBe(129.25);
        expect(entropyOf(10, "  ")).toBe(129.72);
    });
});

function roundEntropy(entropy) {
    return Math.round(entropy * 100) / 100;
}