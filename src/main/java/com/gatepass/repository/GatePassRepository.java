package com.gatepass.repository;

import com.gatepass.entity.GatePass;
import com.gatepass.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GatePassRepository extends JpaRepository<GatePass, Long> {

    // Student: get my gate passes
    List<GatePass> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    // Faculty: get pending passes
    List<GatePass> findByStatusOrderByCreatedAtDesc(GatePass.Status status);

    // Faculty: get passes from assigned students
    @Query("SELECT g FROM GatePass g WHERE g.student.assignedFaculty.id = :facultyId ORDER BY g.createdAt DESC")
    List<GatePass> findByAssignedFacultyId(@Param("facultyId") Long facultyId);

    // Faculty: get pending passes from assigned students
    @Query("SELECT g FROM GatePass g WHERE g.student.assignedFaculty.id = :facultyId AND g.status = 'pending' ORDER BY g.createdAt DESC")
    List<GatePass> findPendingByFacultyId(@Param("facultyId") Long facultyId);

    // Admin: filter by department
    @Query("SELECT g FROM GatePass g WHERE g.student.department = :department ORDER BY g.createdAt DESC")
    List<GatePass> findByStudentDepartment(@Param("department") String department);

    // Admin: filter by date
    List<GatePass> findByDateOrderByCreatedAtDesc(LocalDate date);

    // Admin: filter by department and date
    @Query("SELECT g FROM GatePass g WHERE g.student.department = :department AND g.date = :date ORDER BY g.createdAt DESC")
    List<GatePass> findByDepartmentAndDate(@Param("department") String department, @Param("date") LocalDate date);

    // Stats
    long countByStatus(GatePass.Status status);

    long countByStudentId(Long studentId);

    long countByApprovedByIdAndStatus(Long facultyId, GatePass.Status status);

    // Security: approved passes for today
    @Query("SELECT g FROM GatePass g WHERE g.status = 'approved' AND g.date = :today ORDER BY g.createdAt DESC")
    List<GatePass> findApprovedPassesForToday(@Param("today") LocalDate today);

    // Check active pass for student
    @Query("SELECT COUNT(g) > 0 FROM GatePass g WHERE g.student.id = :studentId AND g.status = 'pending'")
    boolean hasActivePendingPass(@Param("studentId") Long studentId);
}
