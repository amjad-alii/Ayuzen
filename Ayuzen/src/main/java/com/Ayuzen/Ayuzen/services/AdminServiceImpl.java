package com.Ayuzen.Ayuzen.services;

    import com.Ayuzen.Ayuzen.dto.DashboardStatsDTO;
    import com.Ayuzen.Ayuzen.repository.AppointmentRepository;
    import com.Ayuzen.Ayuzen.repository.DoctorRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

@Service // This annotation tells Spring that this is a bean that can be injected.
public class AdminServiceImpl implements AdminService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository; // You may need custom queries here later

    @Override
    public DashboardStatsDTO getDashboardStats() {
        long totalDoctors = doctorRepository.count();

        // NOTE: These are placeholders. You will need to write custom queries
        // in your AppointmentRepository to get the real data.
        long appointmentsToday = 25;
        double totalRevenueToday = 12500.00;

        return DashboardStatsDTO.builder()
                .totalDoctors(totalDoctors)
                .appointmentsToday(appointmentsToday)
                .totalRevenueToday(totalRevenueToday)
                .build();
    }
}

