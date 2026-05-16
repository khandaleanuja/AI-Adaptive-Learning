def adaptive_learning(
    score,
    response_time,
    watch_count,
    current_level
):

    result = {

        "adaptiveLevel": current_level,

        "contentMode": "standard",

        "difficultyLevel": current_level,

        "recommendation": ""
    }

    # ------------------------------------
    # CASE 1:
    # USER WATCHED VIDEO MANY TIMES
    # ------------------------------------

    if watch_count >= 3:

        result["contentMode"] = "simple"

        result["recommendation"] = \
            "User struggling, simplified content enabled"

    # ------------------------------------
    # CASE 2:
    # VERY GOOD PERFORMANCE
    # ------------------------------------

    if score >= 80 and response_time <= 5:

        if current_level < 3:
            current_level += 1

        result["adaptiveLevel"] = current_level

        result["difficultyLevel"] = current_level

        result["contentMode"] = "standard"

        result["recommendation"] = \
            "Difficulty increased"

    # ------------------------------------
    # CASE 3:
    # AVERAGE PERFORMANCE
    # ------------------------------------

    elif score >= 50:

        result["adaptiveLevel"] = current_level

        result["difficultyLevel"] = current_level

        result["recommendation"] = \
            "Current level maintained"

    # ------------------------------------
    # CASE 4:
    # LOW PERFORMANCE
    # ------------------------------------

    else:

        if current_level > 1:
            current_level -= 1

        result["adaptiveLevel"] = current_level

        result["difficultyLevel"] = current_level

        result["contentMode"] = "simple"

        result["recommendation"] = \
            "Difficulty reduced and easy content enabled"

    return result