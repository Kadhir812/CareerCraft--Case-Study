package com.example.backend_careercrafter.specification;


import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.example.backend_careercrafter.model.JobListing;
import com.example.backend_careercrafter.model.enums.JobStatus;
import com.example.backend_careercrafter.model.enums.JobType;

public final class JobListingSpecification {

    private JobListingSpecification() {
    }

    public static Specification<JobListing> withTextQuery(String query) {

                // This is a lambda implementation of Specification. and root finds thr table and entity,
                //cb creates sql conditions(like,or,where)
        return (root, ignored, cb) -> {

            //empty query check
            if (!StringUtils.hasText(query)) {
                return cb.conjunction();
            }

            //pattern query check
            String pattern = "%" + query.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern));
        };
    }

    public static Specification<JobListing> withLocation(String location) {
        return (root, ignored, cb) -> {
            if (!StringUtils.hasText(location)) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%");
        };
    }

    public static Specification<JobListing> withJobType(JobType jobType) {
        return (root, ignored, cb) -> jobType == null ? cb.conjunction() : cb.equal(root.get("jobType"), jobType);
    }

    public static Specification<JobListing> withStatus(JobStatus status) {
        return (root, ignored, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }
}


// Specification<T> is an interface from Spring Data JPA.
// It helps create SQL WHERE conditions dynamically.

// SELECT*
// FROM job_listing
// WHERE
// (
//   LOWER(title) LIKE '%react frontend developer%'
// OR LOWER(description) LIKE '%react frontend developer%'
// )
// AND LOWER(location) LIKE '%chennai%'
// AND job_type = 'FULL_TIME'